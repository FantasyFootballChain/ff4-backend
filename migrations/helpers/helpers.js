/**
 * Returns foreign key setup
 */
exports.getForeignKeySetup = (fkName, fkTable, fkMapping = 'id', fieldType = 'int', onDelete = 'CASCADE', onUpdate = 'CASCADE') => {
	return {
		type: fieldType,
		foreignKey: {
			name: fkName,
			table: fkTable,
			rules: {
				onDelete: onDelete,
				onUpdate: onUpdate
			},
			mapping: fkMapping
		}
	};
}
