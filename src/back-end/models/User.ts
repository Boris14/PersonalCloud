import { DataTypes, Model } from 'sequelize';
import { v4 as generateUUIDv4 } from 'uuid';
import { sequelize } from '../../database.js';

class User extends Model {
    public id!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public created_at!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => generateUUIDv4(),
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
        underscored: true,
    }
);

export default User;