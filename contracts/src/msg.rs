use cosmwasm_std::Addr;
use schemars::JsonSchema;
use cosmwasm_schema::{cw_serde, QueryResponses};
use serde::{Deserialize, Serialize};
use crate::state::{Expense, Group};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    /// Create a new group with given participants
    CreateGroup {
        name: String,
        participants: Vec<Addr>,
    },

    /// Add an expense to a group
    AddExpense {
        group_id: u64,
        paid_by: Addr,
        amount: u128,
        participants: Vec<Addr>,
        description: String,
    },

    /// Settle all debts a user owes in a specific group
    SettleGroupDebt {
        group_id: u64,
    },

    /// Pay your share for a specific expense
    PayExpense {
        group_id: u64,
        expense_id: u64
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, QueryResponses)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /// Get full group data
    #[returns(Group)]
    GetGroup {
        group_id: u64,
    },

    /// Get a specific expense by group and expense ID
    #[returns(Expense)]
    GetExpense {
        group_id: u64,
        expense_id: u64,
    },

    /// Get all groups stored in the contract
    #[returns(AllGroupsResponse)]
    GetAllGroups {},

    /// Get all expenses in a group
    #[returns(GroupExpensesResponse)]
    GetGroupExpenses {
        group_id: u64,
    },

    /// Get list of groups joined by user
    #[returns(UserGroupsResponse)]
    GetUserGroups {
        user: Addr,
    },
}

#[cw_serde]
pub struct AllGroupsResponse {
    pub groups: Vec<(u64, Group)>,
}

#[cw_serde]
pub struct GroupExpensesResponse {
    pub expenses: Vec<Expense>,
}

#[cw_serde]
pub struct UserGroupsResponse {
    pub groups: Vec<(u64, Group)>,
}
