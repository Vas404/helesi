module.exports = ( sequelize, Sequelize )=> {
    const Routes = sequelize.define( 'routes', {
        date: { type: Sequelize.DATE, allowNull: false },
        time: { type: Sequelize.STRING },
        vehicle: { type: Sequelize.STRING , allowNull: false},
        driver: { type: Sequelize.STRING, allowNull: false },
        location: { type: Sequelize.STRING , allowNull: false },
        kg: { type: Sequelize.STRING },
        routebinid: { type: Sequelize.STRING },
        coords: { type: Sequelize.STRING, allowNull: false },
        hash: { type: Sequelize.STRING }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      
    })
    return Routes
}