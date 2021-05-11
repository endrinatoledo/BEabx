let models = require('../models');
const Sequelize = require('sequelize');

const getAllNote = async (req, res) => {
  try {
    let {meeId} = req.params;
    let notes = await models.notesModel.findAll({where: {meeId: meeId}}).catch(err => {
      throw err
    });
    return res.status(200).json({ok: true, notes: notes});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message})
  }
}

const getNoteById = async (req, res) => {
  try {
    let {id} = req.params;
    let note = await models.notesModel.findOne({where: {id: id}}).catch(err => {
      throw err
    })
    return res.status(200).json({ok: true, note: note});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message})
  }
}

const createNote = async (req, res) => {
  try {
    let {title, description, meeId, grpId, noeDate} = req.body;
    let usrId = req.body.usrId.id;
    if (!title || !description || !meeId || !usrId || !grpId || !noeDate) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
    for (let prop in req.body) {
      if (req.body[prop] === null) {
        return res.status(204).json({ok: false, message: 'Los campos son requeridos'});
      }
    }
    let noePosition;
    models.meetingPositionsModel.findAll({
      where: {meeId: req.body.meeId},
      attributes: [[Sequelize.fn('max', Sequelize.col('position')), 'maxPosition']]
    }).then(position => {
      noePosition = position[0][`dataValues`][`maxPosition`] !== "undefined" || null ? Number(position[0][`dataValues`][`maxPosition`] + 1) : 1;
    }).catch(err => {
      throw err
    })
    await models.notesModel.create({
      title: title,
      description: description,
      usrId: usrId,
      meeId: meeId,
      grpId: grpId,
      date: noeDate
    }).then(note => {
      models.meetingPositionsModel.create({
        meeId: Number(req.body.meeId),
        agrId: null,
        asmId: null,
        noeId: note.dataValues.id,
        position: noePosition
      }).then(resp => {
        return res.status(201).json({ok: true, message: 'Nota Creada'});
      }).catch(err => {
        throw err
      })
    }).catch(err => {
      throw err
    })
  } catch
    (err) {
    return res.status(500).json({ok: false, message: err.message})
  }
}

const updateNoteById = async (req, res) => {
  try {
    let {id} = req.params;
    let newBody = {};
    for (let prop in req.body) {
      if (req.body[prop] !== null) {
        newBody[prop] = req.body[prop]
      }
    }
    await models.notesModel.update(newBody, {where: {id}}).catch(err => {
      throw err
    })
    return res.status(200).json({ok: false, message: 'Nota Actualizada'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}


const deleteNoteById = async (req, res) => {
  try {
    let {id} = req.params;
    await models.notesModel.destroy({where: {id: id}}).catch(err => {
      throw err
    });
    return res.status(200).json({ok: true, message: 'Nota Eliminada'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}

module.exports = {
  getAllNote,
  getNoteById,
  createNote,
  updateNoteById,
  deleteNoteById
}
