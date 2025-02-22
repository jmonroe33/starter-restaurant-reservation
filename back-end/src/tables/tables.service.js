const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then(createRecords => createRecords[0])
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id: table_id }).first()
}

function seatTable(reservation_id, table_id) {
    return knex.transaction(function (trx) {
        return knex("tables")
            .where({ table_id: table_id })
            .update({ reservation_id })
            .returning("*")
            .then((updatedTable) => updatedTable[0])
            .then(() => {
                return trx("reservations")
                    .where({ reservation_id })
                    .update({ status: "seated" });
            });
    });
}
function finishTable(table_id, reservation_id) {
    return knex.transaction(function (trx) {
      return trx("tables")
        .where({ table_id: table_id })
        .update({ reservation_id: null })
        .then(() => {
          return trx("reservations")
            .where({ reservation_id })
            .update({ status: "finished" });
        });
    });
  }

function findByName(tableName) {
    return knex("tables")
    .select("*")
    .where({table_name: tableName}).first()
}

function destroy(table_id){
    return knex("tables").where({ table_id }).del()
}

module.exports = {
    list,
    create,
    read,
    seatTable,
    finishTable,
    findByName,
    destroy
}