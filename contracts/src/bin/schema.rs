use cosmwasm_schema::write_api;
use split_x::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

fn main() {
    write_api! {
        instantiate: InstantiateMsg,
        execute: ExecuteMsg,
        query: QueryMsg, // Ensure QueryMsg derives QueryResponses
    }
}
