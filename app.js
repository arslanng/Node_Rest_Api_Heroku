const app = require("express")();
const db = require("./db.json");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", (req, res) => {
  res.status(200).send(db);
});
app.get("/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).send({
      message: "İşlenemeyen veri",
    });
  } else {
    const user = db.find((user) => user.id == req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send({
        message: "Kullanıcı bulunamadı",
      });
    }
  }
});
app.post("/users", (req, res) => {
  const willSaveData = {
    id: new Date().getTime(),
    full_name: req.body.full_name,
    country: req.body.country,
    email: req.body.email,
    created_at: new Date(),
  };
  db.push(willSaveData);
  res.send(willSaveData);
});
app.patch("/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).send({
      message: "İşlenemeyen veri",
    });
  } else {
    const user = db.find((user) => user.id == req.params.id);
    if (user) {
      // Kayıt değişikliği
      // pass by referance ve pass by value araştırılacak.
      Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
      });
      res.status(200).send(user);
    } else {
      res.status(400).send({
        message: "Kullanıcı bulunamadı",
      });
    }
  }
});
app.delete("/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      message: "İşlenemeyen veri",
    });
  } else {
    const userIndex = db.findIndex((user) => user.id == req.params.id);
    if (userIndex > -1) {
      //silme işlemi
      db.splice(userIndex, 1);
      res.status(201).send({
        message: "Kullanıcı Silindi",
      });
    } else {
      res.status(400).send({
        message: "Kullanıcı bulunamadı",
      });
    }
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Sunucu ayaktadır... Çalışıyor...");
});
