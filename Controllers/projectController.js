const ProjectModel = require('../models/ProjectModel');

const getAllProjects = (req, res) => {
  ProjectModel.getAllProjects((error, projects) => {
    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(projects);
  });
};

const getProjectById = (req, res) => {
  const projectId = req.params.id;
  ProjectModel.getProjectById(projectId, (error, project) => {
    if (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });
};

module.exports = {
  getAllProjects,
  getProjectById
};
