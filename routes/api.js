"use strict";
const Issue = require("../models/Issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      const query = req.query;
      query.project = req.params.project;
      const result = await Issue.find(query);
      res.json(result);
    })

    .post(async function (req, res) {
      const project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if (!project || !issue_title || !issue_text || !created_by)
        return res.json({ error: "required field(s) missing" });

      const newIssue = {
        project,
        assigned_to: !assigned_to ? "" : assigned_to,
        status_text: !status_text ? "" : status_text,
        open: true,
        issue_title,
        issue_text,
        created_by,
        created_on: new Date(),
        updated_on: new Date()
      };

      const issue = new Issue(newIssue);
      await issue.save((err, data) => {
        if (err) console.error(err);
        res.json(data);
      });
    })

    .put(async function (req, res) {
      const project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      if (!_id) return res.json({ error: "missing _id" });
      else if (_id && Object.keys(req.body).length === 1)
        return res.json({ error: "no update field(s) sent", _id: _id });

      const newIssue = {
        project,
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        updated_on: new Date(),
        open: open ? false : true
      };

      await Issue.findOneAndUpdate(
        { _id },
        newIssue,
        { new: false },
        (err, data) => {
          if (err) console.error("err", err);
          if (data) res.json({ result: "successfully updated", _id });
          else res.json({ error: "could not update", _id });
        }
      );
    })

    .delete(async function (req, res) {
      const { _id } = req.body;
      if (!_id) return res.json({ error: "missing _id" });

      const result = await Issue.deleteOne({ _id });
      if (result?.deletedCount > 0)
        res.json({ result: "successfully deleted", _id });
      else res.json({ error: "could not delete", _id });
    });
};
