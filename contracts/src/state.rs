use cosmwasm_std::{Addr};
use cw_storage_plus::{Map, Item};
use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct Expense {
    pub id: u64,
    pub is_paid: bool,
    pub amount: u128,
    pub paid_by: Addr,
    pub participants: Vec<Addr>,
    pub description: String,
    pub payments: Vec<Payment>,
}

#[cw_serde]
pub struct Payment {
    pub payer: Addr,
    pub amount: u128,
    pub paid: bool,
}

#[cw_serde]
pub struct Group {
    pub name: String,
    pub creator: Addr,
    pub participants: Vec<Addr>,
}

// A global counter to track how many groups have been created
pub const GROUP_COUNTER: Item<u64> = Item::new("group_counter");

/// Stores all group metadata: group_id => Group
pub const GROUPS: Map<u64, Group> = Map::new("groups");

/// Maps user => list of group_ids they are part of
pub const USER_GROUPS: Map<&Addr, Vec<u64>> = Map::new("user_groups");

/// Group-wide counter to track number of expenses: group_id => count
pub const GROUP_EXPENSES_COUNT: Map<u64, u64> = Map::new("group_expense_count");

/// Grouped expenses: (group_id, expense_id) => Expense
pub const GROUP_EXPENSES: Map<(u64, u64), Expense> = Map::new("group_expenses");

// Debts between any two users: (debtor, creditor) => total amount owed
// pub const DEBTS: Map<(Addr, Addr), u128> = Map::new("debts");
