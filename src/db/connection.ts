import { Client } from "pg"

export const db_client = new Client({
    connectionString: "postgresql://postgres:1234@localhost:5432/testuchun_sql"
})

db_client.connect()

console.log('connected!');


