const mongoose = require("mongoose");
const Email = require("../models/Email");
const main = require("../helpers/MailSender");
const path = require('path');

/* Permet d'envoyer à un email */
const SendEmail = async (req, res) => {
  try {
    const email = new Email({
      email_sender: req.body.email_sender,
      email_receiver: req.body.email_receiver,
      subject: req.body.subject,
      content: req.body.content,
      cc: req.body.cc,
      sending_date: Date.now(),
      reception_date: Date.now(),
      
    });

    // Si votre middleware de gestion de fichiers (multer) est configuré, vous pouvez accéder à req.file
    if (req.file) {
      // Stocker uniquement le chemin du fichier dans la propriété attachment de l'email
      email.file = req.file.path;
      email.fileName = req.file.originalname;  

    }

    await email.save();

    console.log("Email saved successfully");

    res.status(200).json(email);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const SendEmail = async (req, res) => {
//   try {
//     const email = new Email({
//       email_sender: req.body.email_sender,
//       email_receiver: req.body.email_receiver,
//       subject: req.body.subject,
//       content: req.body.content,
//       cc: req.body.cc,
//       sending_date: Date.now(),
//       reception_date: Date.now(),
//       files: req.files.map((file) => ({
//         file: file.path,
//         fileName: file.originalname,
//       })),
//     });

//     await email.save();

//     console.log("Email saved successfully");

//     res.status(200).json(email);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

/* Permet de mettre à jour un email en cas de brouillon */
const UpdateEmail = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;
    await Email.findOneAndUpdate(filter, update);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/* Permet de supprimer un Email */
const DeleteEmail = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    await Email.findOneAndRemove(filter);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/* Récupérer tous les emails */
const GetAll = async (req, res) => {
  try {
    let result = await Email.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
/* Récupérer tous les emails d'un utilisateur */
const GetUserEmails = async (req, res) => {
  try {
    const filter = { email_receiver: req.params.email };
    let result = await Email.find({ filter });
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/* Récupérer uns seul email en utilisant son identifiant */
const GetOne = async (req, res) => {
  try {
    let result = await Email.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/* Récupérer les emails page par page */
const GetInboxPaginated = async (req, res, next) => {
  try {
    const { pageNumber = 1, pageSize = 10 , emailReceiver} = req.query;
    const filter = {email_receiver: emailReceiver, draft: 0, trash: 0}

    const totalPages = Math.ceil((
      await Email.countDocuments(filter) / pageSize 
    )); 
 
    let emails = await Email.find(filter)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize)
      .sort({sending_date: -1}); 

    return res.status(200).send({
      totalPages, 
      emails,
      page: pageNumber,
    });
    
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

/* Récupérer les emails sortants page par page */
const GetSentPaginated = async (req, res, next) => {
  try {
    const { pageNumber = 1, pageSize = 10, emailSender = '' } = req.query;
    const filter = {email_sender : emailSender, trash : 0, draft : 0}
    
    const totalPages = Math.ceil((
      await Email.countDocuments(filter) / pageSize 
    )); 
    
    let emails = await Email.find(filter)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize)
      .sort({sending_date: -1}); 

    return res.status(200).send({
      totalPages, 
      emails,
      page: pageNumber,
    });
    
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// DRAFTS CONTROLLERS //////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getDrafts = async (req, res) => {
  try {
    const emails = await Email.find({ draft: 1 });
    res.status(200).json(emails);
  } catch (error) {
    console.error('Erreur lors de la récupération des brouillons :', error.message);
    res.status(500).json({ message: 'Erreur Interne du Serveur' });
  }
};


const MarkAsDraft = async (req, res) => {
  try {
    // Créez une nouvelle instance de l'e-mail en définissant draft à 1
    const emails = new Email({ ...req.body, draft: 1 });
    
    // Enregistrez l'e-mail
    await emails.save();

    res.status(200).json(emails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
const updateDraft = async (req, res) => {
  try {
      const { id } = req.params; // Change 'emailId' to 'id'
      const updateDraft = await Drafts.findByIdAndUpdate(id, req.body, { new: true });
      if (!updateDraft) {
          return res.status(404).json({ message: 'Brouillon non trouvé' });
      }
      res.json({ draft: updateDraft, message: 'Brouillon modifié avec succès' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la modification du brouillon', error: error.message });
  }
};



/* Récupérer les emails sortants page par page */
const GetDraftPaginated = async (req, res, next) => {
  try {
    const { pageNumber = 1, pageSize = 10 , emailSender} = req.query;
    const filter = {email_sender : emailSender, draft: 1, trash:0}

    const totalPages = Math.ceil((
      await Email.countDocuments(filter) / pageSize 
    )); 
 
    let emails = await Email.find(filter)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize)
      .sort({sending_date: -1}); 

    return res.status(200).send({
      totalPages, 
      emails,
      page: pageNumber,
    });
    
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// TRASH CONTROLLERS //////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MoveToTrash = async (req, res) => {
  try {
    const id = req.params.id;

    // Mettez à jour le champ inTrash de 0 à 1 dans le document Email
    const updatedEmail = await Email.findByIdAndUpdate(id, { trash: 1 }, { new: true });

    if (!updatedEmail) {
      return res.status(404).json({ message: 'E-mail introuvable' });
    }

    res.status(200).json({ message: 'Champ inTrash mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du champ inTrash :', error.message);
    res.status(500).json({ message: 'Erreur Interne du Serveur' });
  }
};


const getTrashes = async (req, res) => {
  try {
    const emails = await Email.find({ trash: 1 });
    res.status(200).json(emails);
  } catch (error) {
    console.error('Erreur lors de la récupération des brouillons :', error.message);
    res.status(500).json({ message: 'Erreur Interne du Serveur' });
  }
};
const deleteEmail = async (req, res) => {
  try {
      const id = req.params.id;

      // Vérifier si l'e-mail existe dans la corbeille
      const email = await Email.findById(id);
      if (!email) {
          return res.status(404).json({ message: 'Email not found in the trash' });
      }

      // Supprimer définitivement l'e-mail de la collection "trashes"
      await Email.findByIdAndDelete(id);

      res.json({ message: 'Email deleted successfully' });
  } catch (error) {
      console.error('Error deleting email:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getTrashPaginated = async (req, res, next) => {
  try {
      const { pageNumber = 1, pageSize = 10, emailSender = '' } = req.query;
      const { user } = req.session
      const filter = { email_sender: emailSender, trash: 1 }

      const totalPages = Math.ceil(
          (await Email.countDocuments(filter)) / pageSize
      );

      let emails = await Email.find(filter)
          .limit(pageSize * 1)
          .skip((pageNumber - 1) * pageSize)
          .sort({ sending_date: -1 });

      return res.status(200).send({
          totalPages,
          emails,
          page: pageNumber,
      });

  } catch (error) {
      console.log(error.message);
      next(error);
  }
};
// Restaurer un email depuis la corbeille
const RestoreFromTrash = async (req, res) => {
  try {
    const emailId = req.params.id;

    // Mettez à jour le champ trash de 1 à 0 dans le document Email
    const updatedEmail = await Email.findByIdAndUpdate(emailId, { trash: 0 }, { new: true });

    if (!updatedEmail) {
      return res.status(404).json({ message: 'E-mail introuvable' });
    }

    res.status(200).json({ message: 'Champ trash mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du champ trash :', error.message);
    res.status(500).json({ message: 'Erreur Interne du Serveur' });
  }
};



const emailInfos = {
    from: "contact@cdec-digital.com",
    to: "snccdec@gmail.com", 
    subject: "Reset password email", 
    text: "Please click link to reset password", 
    html: '<h1>Email Receiver</h1>' 
}

const sendSMTPEmail = async (req, res) => {
    main(emailInfos);
    res.status(200).send({message: "Email sent"})
}; 

// telecharger la piece jointe 
const downloadAttachment = async (req, res) => {
  try {
    const emailId = req.params.id;
    const email = await Email.findById(emailId);

    if (!email || !email.file) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    const filePath = path.join(__dirname, `../${email.file}`);
    res.download(filePath);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


/* Exporter le module */
module.exports = {
  getDrafts, 
  updateDraft, 
  MarkAsDraft,
  sendSMTPEmail,
  SendEmail,
  UpdateEmail,
  GetAll,
  GetUserEmails,
  GetOne,
  DeleteEmail,
  GetInboxPaginated,
  GetSentPaginated,
  GetDraftPaginated,
  getTrashPaginated,
  getTrashes,
  deleteEmail,
  MoveToTrash,
  downloadAttachment ,
  RestoreFromTrash
};
