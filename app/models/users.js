module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('user', {
      
      name: { type: Sequelize.STRING },
      surname: { type: Sequelize.STRING },
      username: { type: Sequelize.STRING, required: true, unique: true, primary: true, allowNull: false },
      password: { type: Sequelize.STRING, required: true },
      email: { type: Sequelize.STRING, validate:{isEmail: true}, unique: true, required: true },
      //emails are unique, so are usernames 
      role: { type: Sequelize.ENUM('admin','user','superadmin'),required: true, default: 'user'}, 
      //make all new users{user}
      createdById: { type: Sequelize.STRING, required: true, default: null }
      },
      {
         //freezeTableName: true
       charset: 'utf8',
     
    })
  
    return Users
  }
