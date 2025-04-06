#[cfg(test)]
mod tests {
    use std::collections::HashSet;

    use crate::contract::{execute, instantiate, query};
    use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, UserGroupsResponse};
    use crate::state::{Expense};
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{from_json, Addr, Uint128};

    #[test]
    fn test_create_group_and_query_user_groups() {
        let mut deps = mock_dependencies();

        let instantiate_msg = InstantiateMsg {};
        let instantiate_info = mock_info("anyone", &[]);
        instantiate(deps.as_mut(), mock_env(), instantiate_info, instantiate_msg).unwrap();

        let alice = Addr::unchecked("alice");
        let bob = Addr::unchecked("bob");
        let charlie = Addr::unchecked("charlie");
        let participants = vec![bob.clone(), charlie.clone()];

        let creator = mock_info("alice", &[]);
        let create_msg = ExecuteMsg::CreateGroup {
            name: "Test Group".to_string(),
            participants: participants.clone(),
        };

        let res = execute(deps.as_mut(), mock_env(), creator.clone(), create_msg).unwrap();
        println!("✅ Execute Response: {:?}", res);

        let query_msg = QueryMsg::GetUserGroups { user: alice.clone() };
        let bin = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let decoded: UserGroupsResponse = from_json(&bin).unwrap();
        println!("📬 Decoded Query Response: {:?}", decoded);

        assert_eq!(decoded.groups.len(), 1);
        let (_id, group) = &decoded.groups[0];
        let expected: HashSet<_> = vec![alice.clone(), bob.clone(), charlie.clone()].into_iter().collect();
        let actual: HashSet<_> = group.participants.iter().cloned().collect();
        assert_eq!(expected, actual);
        assert_eq!(group.creator, alice);
    }

    #[test]
    fn test_add_expense_to_group() {
        let mut deps = mock_dependencies();
        instantiate(deps.as_mut(), mock_env(), mock_info("init", &[]), InstantiateMsg {}).unwrap();

        // Create group
        let creator = mock_info("alice", &[]);
        let participants = vec![Addr::unchecked("bob"), Addr::unchecked("charlie")];
        execute(
            deps.as_mut(),
            mock_env(),
            creator.clone(),
            ExecuteMsg::CreateGroup {
                name: "Dinner".to_string(),
                participants: participants.clone(),
            },
        )
        .unwrap();

        // Add expense
        let expense_msg = ExecuteMsg::AddExpense {
            group_id: 0,
            description: "Dinner bill".to_string(),
            amount: 300,
            participants: participants.clone(),
            paid_by: creator.sender.clone(),
        };

        let res = execute(deps.as_mut(), mock_env(), creator.clone(), expense_msg).unwrap();
        println!("🍽️ Add Expense Response: {:?}", res);

        // Check storage
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetExpense { group_id: 0, expense_id: 0 },
        ).unwrap();
        let expense: Expense = from_json(&res).unwrap();

        assert_eq!(expense.amount, 300);
        assert_eq!(expense.description, "Dinner bill");
        assert_eq!(expense.paid_by, creator.sender);
        assert_eq!(expense.participants, participants);
    }

    #[test]
    fn test_pay_expense() {
        let mut deps = mock_dependencies();
        instantiate(deps.as_mut(), mock_env(), mock_info("init", &[]), InstantiateMsg {}).unwrap();

        let creator = mock_info("alice", &[]);
        let bob = Addr::unchecked("bob");
        let charlie = Addr::unchecked("charlie");
        let participants = vec![bob.clone(), charlie.clone()];

        // Create group and add expense
        execute(
            deps.as_mut(),
            mock_env(),
            creator.clone(),
            ExecuteMsg::CreateGroup {
                name: "Trip".to_string(),
                participants: participants.clone(),
            },
        )
        .unwrap();

        execute(
            deps.as_mut(),
            mock_env(),
            creator.clone(),
            ExecuteMsg::AddExpense {
                group_id: 0,
                description: "Hotel".to_string(),
                amount: 600,
                participants: participants.clone(),
                paid_by: creator.sender.clone(),
            },
        )
        .unwrap();

        // Bob pays his share
        let payment = mock_info("bob", &[cosmwasm_std::Coin { denom: "uxion".to_string(), amount: Uint128::new(300) }]);
        let pay_msg = ExecuteMsg::PayExpense {
            group_id: 0,
            expense_id: 0
        };

        let res = execute(deps.as_mut(), mock_env(), payment, pay_msg).unwrap();
        println!("💸 Payment Response: {:?}", res);

        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetExpense { group_id: 0, expense_id: 0 },
        ).unwrap();
        let expense: Expense = from_json(&res).unwrap();

        assert!(expense.payments.iter().any(|p| p.payer == bob && p.paid && p.amount == 300));
    }
}
