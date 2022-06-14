module.exports = (sequelize, Sequelize) => {
    const Wastes = sequelize.define('waste', {
      
      date: { type: Sequelize.DATE, allowNull: true },
      time: { type: Sequelize.STRING },
      vehicle: { type: Sequelize.STRING },
      driver:{ type: Sequelize.STRING, allowNull: true },
      location: { type: Sequelize.STRING, allowNull: true }, 
      coords: { type: Sequelize.STRING, allowNull: false, required: true },
      kg: { type: Sequelize.STRING },
      route: { type: Sequelize.STRING },
      pass: { type: Sequelize.STRING },
      type: {type: Sequelize.STRING , allowNull: true},
      material: { type: Sequelize.STRING },
      quality: { type: Sequelize.STRING, allowNull: true },      
      hash: { type: Sequelize.STRING },
      adminId:{ type: Sequelize.STRING, allowNull: true, default:'Aratos'}
    },
 
      {
         //freezeTableName: true
       charset: 'utf8',
       collate: 'utf8_unicode_ci'
     
    })
  
    return Wastes;
  }
