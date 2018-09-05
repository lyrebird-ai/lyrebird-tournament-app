const crypto = require("crypto");
const dotenv = require("dotenv");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const unirest = require("unirest");

dotenv.config();

const env = require("./env");
const AvatarApi = require("./avatar");
const avatar = new AvatarApi(env.avatarUrl, env.client.id, env.client.secret);

const app = express();
let db = null;
const UTTERANCE = "When you play a game of thrones you win or you die.";
const DB_PARTICIPANTS_C = "participants";

MongoClient.connect(
  env.db.url,
  {
    useNewUrlParser: true
  },
  function(err, client) {
    if (err) {
      throw new Error(err);
      return;
    }
    db = client.db(env.db.name);
    db.createIndex(
      DB_PARTICIPANTS_C,
      {
        user_id: 1
      },
      {
        unique: true
      }
    );
  }
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      math: function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
        }[operator];
      }
    }
  })
);

app.set("view engine", "handlebars");

app.get("/", async (req, res) => {
  const collection = db.collection(DB_PARTICIPANTS_C);
  const count = await collection.countDocuments({});

  if (count === 0) {
    return res.render("home", {
      publicUrl: env.publicUrl
    });
  }

  const ramdomUId = Math.floor(Math.random() * count);
  var participant = await collection.findOne({
    random: ramdomUId
  });
  req.session.current = ramdomUId;
  var participants = await collection
    .aggregate([
      {
        $project: {
          audio: "$audio",
          name: "$display_name",
          note: {
            $divide: ["$total", "$count"]
          }
        }
      },
      {
        $sort: {
          note: -1
        }
      },
      {
        $limit: 100
      }
    ])
    .toArray();

  if (!participant) {
    participant = {};
  }

  res.render("home", {
    name: participant.display_name,
    audio: participant.audio,
    participants: participants.map(i => {
      i.note = Math.round(i.note * 100) / 100;
      return i;
    }),
    publicUrl: env.publicUrl
  });
});

app.get("/authorize", (req, res) => {
  const state = crypto.randomBytes(24).toString("hex");
  const query = {
    response_type: "code",
    client_id: env.client.id,
    redirect_uri: env.client.redirectUri,
    state,
    scope: "profile voice"
  };
  const queryString = Object.entries(query)
    .map(item => `${item[0]}=${item[1]}`)
    .join("&");
  const url = `${env.myvoiceUrl}/authorize?${queryString}`;
  req.session.state = state;
  res.redirect(url);
});

app.get("/oauth", async (req, res, next) => {
  try {
    const { state } = req.session;
    req.session.state = undefined;
    if (state !== req.query.state) {
      return res.render("error", {
        publicUrl: env.publicUrl
      });
    }

    const token = await avatar.getToken(req.query.code);
    const profile = await avatar.getProfile(token);
    const collection = db.collection(DB_PARTICIPANTS_C);
    const found = await collection.findOne({
      email: profile.email
    });
    if (found) {
      return res.render("success", {
        publicUrl: env.publicUrl
      });
    }

    await avatar.generate(token, UTTERANCE);
    const audios = await avatar.getGenerated(token);
    const audio = audios[0];
    const count = await collection.countDocuments({});
    await collection.updateOne(
      {
        user_id: profile.user_id
      },
      {
        $set: {
          ...profile,
          token,
          audio: audio.url,
          random: count
        }
      },
      {
        upsert: true,
        safe: false
      }
    );
    return res.render("success", {
      publicUrl: env.publicUrl
    });
  } catch (e) {
    let err = new Error(e);
    next(err);
  }
});

app.get("/vote", async (req, res) => {
  const collection = db.collection(DB_PARTICIPANTS_C);
  const total = parseInt(req.query.note + "dbcd");
  if (isNaN(total)) {
    let err = new Error(`${req.query.note} should be a number`);
    next(err);
  }
  await collection.updateOne(
    {
      random: req.session.current
    },
    {
      $inc: {
        total: total,
        count: 1
      }
    },
    {
      upsert: true,
      safe: false
    }
  );
  res.redirect("/");
});

app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

app.listen(env.port, () =>
  console.log(
    `Lyrebird Voice Tournament Sample app listening on port ${env.port}!`
  )
);
