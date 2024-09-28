import { validationResult } from "express-validator";

const createGenericController = (repository, fieldName) => {
    return {
        async create(req, res) {
            const data = req.body;
            console.log('Body da requisição:', req.body);
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                return res.status(400).json({ erro: validation.array() });
            }

            try {
                console.log('fieldName:', fieldName);
                console.log(data[fieldName]);
                const existingItem = await repository.getByField(data[fieldName]);
                if (existingItem.length > 0) {
                    return res.status(400).json({ success: false, msg: `${fieldName} já existe.`, existingItems: existingItem });
                }

                const newItem = await repository.create({ data });
                res.json({
                    success: true,
                    msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} criado com sucesso`,
                    item: newItem,
                });
            } catch (error) {
                res.status(500).json({ success: false, msg: `Falha ao criar ${fieldName}: ${error.message}` });
            }
        },

        async getAll(req, res) {
            try {
                const items = await repository.getAll();
                res.json({
                    success: true,
                    msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} encontrados com sucesso`,
                    items,
                });
            } catch (error) {
                res.status(500).json({ success: false, msg: `Falha ao buscar ${fieldName}s` });
            }
        },

        async getById(req, res) {
            const { id } = req.params;

            try {
                const item = await repository.getById(parseInt(id));
                if (!item) return res.status(404).json({ success: false, msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} não encontrado` });

                res.json({
                    success: true,
                    msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} encontrado com sucesso`,
                    item,
                });
            } catch (error) {
                res.status(500).json({ success: false, msg: `Falha ao buscar ${fieldName}` });
            }
        },

        async update(req, res) {
            const { id } = req.params;
            const { [fieldName]: fieldValue } = req.body;

            try {
                const item = await repository.getById(parseInt(id));
                if (!item) return res.status(404).json({ success: false, msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} não encontrado` });

                const updatedItem = await repository.update(parseInt(id), { ...(fieldValue && { [fieldName]: fieldValue }) });
                res.json({
                    success: true,
                    msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} atualizado com sucesso`,
                    item: updatedItem,
                });
            } catch (error) {
                res.status(500).json({ success: false, msg: `Falha ao atualizar ${fieldName}` });
            }
        },

        async delete(req, res) {
            const { id } = req.params;

            try {
                const item = await repository.getById(parseInt(id));
                if (!item) return res.status(404).json({ success: false, msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} não encontrado` });

                await repository.delete(parseInt(id));
                res.json({
                    success: true,
                    msg: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} deletado com sucesso`,
                });
            } catch (error) {
                res.status(500).json({ success: false, msg: `Falha ao deletar ${fieldName}` });
            }
        },
    };
};

export default createGenericController;