import { DataTypes, Model } from 'sequelize';
import { v4 as generateUUIDv4 } from 'uuid';
import { sequelize } from '../../database.js';

class File extends Model {
    public id!: string;
    public owner_id!: string;
    public parent_id!: string;
    public is_folder!: boolean;
    public filename!: string;
    public size!: number;
    public uploaded_at!: Date;
    public modified_at!: Date;
}

File.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => generateUUIDv4(),
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        parent_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'files',
                key: 'id',
            },
        },
        is_folder: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        uploaded_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        modified_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'File',
        tableName: 'files',
        timestamps: false,
        underscored: true,
    }
);

export default File;
