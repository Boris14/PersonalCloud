import { DataTypes, Model } from 'sequelize';
import { v4 as generateUUIDv4 } from 'uuid';
import { sequelize } from '../database.js';

class SharedWith extends Model {
    public id!: string;
    public folder_id!: string;
    public shared_to_user_id!: string;
    public permission_level!: number;
    public shared_at!: Date;
}

export const PermissionLevels = {
    INVALID: 0,
    READ: 1,
    READ_WRITE: 2,
};

SharedWith.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => generateUUIDv4(),
        },
        folder_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'files',
                key: 'id',
            },
        },
        shared_to_user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        permission_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[PermissionLevels.INVALID, PermissionLevels.READ, PermissionLevels.READ_WRITE]],
            },
        },
        shared_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'SharedWith',
        tableName: 'shared_with',
        timestamps: false,
        underscored: true,
    }
);

export default SharedWith;
