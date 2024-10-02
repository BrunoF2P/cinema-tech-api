import prisma from "../../prismaClient.js";

async function findAll(model, include = null) {
    return prisma[model].findMany({
        ...(include && { include }),
    });
}

async function findByUnique(model, uniqueField, id, include = null) {
    const where = {};
    where[uniqueField] = id;
    return prisma[model].findUnique({
        where,
        ...(include && { include }),
    });
}

async function create(model, data, include = null) {
    return prisma[model].create({
        data,
        ...(include && { include }),
    });
}

async function update(model, idField, id, data, include = null) {
    const where = {};
    where[idField] = id;
    return prisma[model].update({
        where,
        data,
        ...(include && { include }),
    });
}

async function deleteById(model, idField, id) {
    const where = {};
    where[idField] = id;
    return prisma[model].delete({
        where,
    });
}

async function findByField(model, fieldName, fieldValue, include = null) {
    const where = {};
    where[fieldName] = fieldValue;
    return prisma[model].findMany({
        where,
        ...(include && { include }),
    });
}

export { findAll, findByUnique, create, update, deleteById, findByField };
