use cosmwasm_std::{entry_point, to_json_binary, Addr, BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Uint128};
// use cw_storage_plus::Bound;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
// use std::collections::HashMap;
use crate::state::{Expense, Group, Payment, GROUPS, GROUP_COUNTER, GROUP_EXPENSES, GROUP_EXPENSES_COUNT, USER_GROUPS};
use crate::error::ContractError;

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Start group counter at 0
    GROUP_COUNTER.save(_deps.storage, &0)?;

    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateGroup { name, participants } => {
            try_create_group(deps, info, name, participants)
        }
        ExecuteMsg::AddExpense { group_id, description, participants , paid_by, amount,} => {
            try_add_expense(deps, info, group_id, paid_by, amount, description, participants)
        }
        ExecuteMsg::PayExpense { group_id, expense_id } => {
            try_pay_expense(deps, info, group_id, expense_id)
        }
        ExecuteMsg::SettleGroupDebt { group_id } => {
            try_settle_group_debt(deps, info, group_id)
        }
    }
}

fn try_create_group(
    deps: DepsMut,
    info: MessageInfo,
    name: String,
    participants: Vec<Addr>,
) -> Result<Response, ContractError> {
    let id = GROUP_COUNTER.load(deps.storage)?;
    GROUP_COUNTER.save(deps.storage, &(id + 1))?;

    let mut participants = participants.clone();
    if !participants.contains(&info.sender) {
        participants.push(info.sender.clone());
    }

    let group = Group {
        name: name.clone(),
        creator: info.sender.clone(),
        participants: participants.clone(),
    };
    GROUPS.save(deps.storage, id, &group)?;

    // Store group id in USER_GROUPS for each participant
    for addr in &participants {
        let mut current_groups = USER_GROUPS.may_load(deps.storage, addr)?.unwrap_or_default();
        current_groups.push(id);
        USER_GROUPS.save(deps.storage, addr, &current_groups)?;
    }

    // Also add the creator if not already included
    if !participants.contains(&info.sender) {
        let mut current_groups = USER_GROUPS.may_load(deps.storage, &info.sender)?.unwrap_or_default();
        current_groups.push(id);
        USER_GROUPS.save(deps.storage, &info.sender, &current_groups)?;
    }

    Ok(Response::new()
        .add_attribute("action", "create_group")
        .add_attribute("group_id", id.to_string())
        .add_attribute("name", name))
}

fn try_add_expense(
    deps: DepsMut,
    info: MessageInfo,
    group_id: u64,
    paid_by: Addr,
    amount: u128,
    description: String,
    participants: Vec<Addr>, // Already validated
) -> Result<Response, ContractError> {
    let group = GROUPS.load(deps.storage, group_id)?;
    let group_participants = group.participants;

    if !group_participants.contains(&info.sender) {
        return Err(ContractError::Std(StdError::generic_err("Sender not a group participant")));
    }

    if participants.is_empty() {
        return Err(ContractError::Std(StdError::generic_err("No participants provided")));
    }

    for p in &participants {
        if !group_participants.contains(p) {
            return Err(ContractError::Std(StdError::generic_err("Invalid participant")));
        }
    }

    if !group_participants.contains(&paid_by) {
        return Err(ContractError::Std(StdError::generic_err("Paid_by must be a group participant")));
    }

    // ✅ Check for equal split
    let num_participants = participants.len() as u128;
    if amount % num_participants != 0 {
        return Err(ContractError::Std(StdError::generic_err(
            "Amount must be divisible equally among participants",
        )));
    }

    let share = amount / num_participants;

    // ✅ Pre-fill payment if paid_by is also a participant
    let mut payments = vec![];
    if participants.contains(&paid_by) {
        payments.push(Payment {
            payer: paid_by.clone(),
            amount: share,
            paid: true,
        });
    }

    let expense_id = GROUP_EXPENSES_COUNT
        .may_load(deps.storage, group_id)?
        .unwrap_or_default();

    let expense = Expense {
        id: expense_id,
        paid_by,
        participants: participants.clone(),
        amount,
        description: description.clone(),
        is_paid: false,
        payments,
    };

    GROUP_EXPENSES.save(deps.storage, (group_id, expense_id), &expense)?;
    GROUP_EXPENSES_COUNT.save(deps.storage, group_id, &(expense_id + 1))?;

    Ok(Response::new()
        .add_attribute("action", "add_expense")
        .add_attribute("group_id", group_id.to_string())
        .add_attribute("expense_id", expense_id.to_string())
        .add_attribute("description", description))
}

fn try_pay_expense(
    deps: DepsMut,
    info: MessageInfo,
    group_id: u64,
    expense_id: u64,
) -> Result<Response, ContractError> {
    let mut expense = GROUP_EXPENSES.load(deps.storage, (group_id, expense_id))?;

    // Validate sender is a participant
    let sender = info.sender.clone();
    if !expense.participants.contains(&sender) {
        return Err(ContractError::Std(StdError::generic_err("You are not a participant in this expense")));
    }

    // Prevent payer from paying themselves
    if sender == expense.paid_by {
        return Err(ContractError::Std(StdError::generic_err("Payer does not owe anything")));
    }

    // Calculate how much the sender owes
    let share = Uint128::from(expense.amount)
        .checked_div(Uint128::from(expense.participants.len() as u128))
        .map_err(|_| ContractError::Std(StdError::generic_err("Division error")))?;

    // Check if they already paid
    let already_paid = expense
        .payments
        .iter()
        .any(|p| p.payer == sender && p.paid == true);

    if already_paid {
        return Err(ContractError::Std(StdError::generic_err("Already paid")));
    }

    // Check payment amount
    let amount_sent = info
        .funds
        .iter()
        .find(|c| c.denom == "uxion")
        .map(|c| c.amount)
        .unwrap_or_else(Uint128::zero);

    if amount_sent < share {
        return Err(ContractError::Std(StdError::generic_err("Insufficient payment sent")));
    }

    // Record the payment
    expense.payments.push(Payment {
        payer: sender.clone(),
        paid: true,
        amount: share.u128(),
    });

    // Check if all participants (except paid_by) have paid
    let total_expected_payers = expense
        .participants
        .iter()
        .filter(|p| **p != expense.paid_by)
        .count();

    if expense.payments.len() == total_expected_payers {
        expense.is_paid = true;
    }

    GROUP_EXPENSES.save(deps.storage, (group_id, expense_id), &expense)?;

    Ok(Response::new()
        .add_message(BankMsg::Send {
            to_address: expense.paid_by.to_string(),
            amount: vec![Coin {
                denom: "uxion".to_string(),
                amount: share,
            }],
        })
        .add_attribute("action", "pay_expense")
        .add_attribute("group_id", group_id.to_string())
        .add_attribute("expense_id", expense_id.to_string())
        .add_attribute("from", info.sender.to_string())
        .add_attribute("to", expense.paid_by.to_string())
        .add_attribute("amount", share.to_string()))
}

fn try_settle_group_debt(
    _deps: DepsMut,
    _info: MessageInfo,
    _group_id: u64,
) -> Result<Response, ContractError> {
    Err(ContractError::Std(StdError::generic_err(
        "Functionality not implemented yet",
    )))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetGroup { group_id } => {
            let group = GROUPS.load(deps.storage, group_id)?;
            to_json_binary(&group)
        }

        QueryMsg::GetExpense { group_id, expense_id } => {
            let expense = GROUP_EXPENSES.load(deps.storage, (group_id, expense_id))?;
            to_json_binary(&expense)
        }

        QueryMsg::GetAllGroups {} => {
            let groups = GROUPS
                .range(deps.storage, None, None, cosmwasm_std::Order::Ascending)
                .map(|item| {
                    let (id, group) = item?;
                    Ok((id, group))
                })
                .collect::<StdResult<Vec<_>>>()?;

            to_json_binary(&crate::msg::AllGroupsResponse { groups })
        }

        QueryMsg::GetGroupExpenses { group_id } => {
            let expenses = GROUP_EXPENSES
                .prefix(group_id)
                .range(deps.storage, None, None, cosmwasm_std::Order::Ascending)
                .map(|item| {
                    let (_id, exp) = item?;
                    Ok(exp)
                })
                .collect::<StdResult<Vec<_>>>()?;

            to_json_binary(&crate::msg::GroupExpensesResponse { expenses })
        }

        QueryMsg::GetUserGroups { user } => {
            let group_ids = USER_GROUPS.may_load(deps.storage, &user)?.unwrap_or_default();

            let mut groups = vec![];
            for group_id in group_ids {
                let group = GROUPS.load(deps.storage, group_id)?;
                groups.push((group_id, group));
            }

            to_json_binary(&crate::msg::UserGroupsResponse { groups })
        }
    }
}
