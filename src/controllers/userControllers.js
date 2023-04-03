// const usersData = {...}
// exports.getUser = (req, res, next) => {
//     const id = req.params.userId;
//         if (id && usersData[id]) {
//             res.json(usersData[id]);
//             res.status(200).send();
//         } else {
//             // Not Found
//             res.status(404).send();
//         }
// };
// // to retrieve resource
// exports.getAll = (req, res, next) => {
//         // Respond with some data and return status OK
//         res.json(usersData);
//         res.status(200).send();
// };
// // to create new resources
// exports.createUser = (req, res, next) => {
//             // Return our request body and return status OK
//             res.json(req.body).status(200).send();
// };