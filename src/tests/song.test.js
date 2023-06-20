const request = require("supertest");
const app = require("../app");
const Song = require("../models/Song");
const db = require("../config/database");
const User = require("../models/User");
const jwt = require("../config/jwt");

describe("Song API", () => {
  beforeAll(async () => {
    await db.connectDB();
  });

  afterAll(async () => {
    await db.closeDB();
  });

  beforeEach(async () => {
    await Song.deleteMany();
    await User.deleteMany();
  });

  describe("GET /api/song", () => {
    it("should return a list of songs", async () => {
      const response = await request(app).get("/api/song");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return songs with correct attributes", async () => {
      // Crear un usuario de prueba
      const user = await User.create({
        name: "John Doe",
        username: "john@example.com",
        password: "password",
      });

      // Crear una canción asociada al usuario
      const songData = {
        title: "Canción de prueba",
        artist: "Artista de prueba",
        date: "2023-05-01",
        photo: "https://example.com/photo.jpg",
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 0.12345,
        },
        user: user._id,
      };
      const createdSong = await Song.create(songData);

      const response = await request(app).get("/api/song");
      expect(response.status).toBe(200);

      const songs = response.body;
      expect(songs).toBeInstanceOf(Array);
      expect(songs.length).toBe(1);

      const song = songs[0];
      expect(song._id).toBe(createdSong._id.toString());
      expect(song.title).toBe("Canción de prueba");
      expect(song.artist).toBe("Artista de prueba");
      expect(song.date).toBe("2023-05-01T00:00:00.000Z");
      expect(song.photo).toBe("https://example.com/photo.jpg");
      expect(song.location).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 0.12345,
      });
      expect(song.user).toBe(user._id.toString());
    });
  });

  describe("GET /api/song/search", () => {
    it("should return filtered songs based on search parameters", async () => {
      // Crear canciones de prueba
      const user = await User.create({
        name: "John Doe",
        username: "john@example.com",
        password: "password",
      });

      await Song.create({
        title: "Song1",
        artist: "Artist1",
        date: "2023-05-01",
        photo: "https://example.com/photo1.jpg",
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
        },
        user: user._id,
      });
      await Song.create({
        title: "Song2",
        artist: "Artist2",
        date: "2023-05-02",
        photo: "https://example.com/photo2.jpg",
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
        },
        user: user._id,
      });

      const response = await request(app).get(
        "/api/song?title=Song1&artist=Artist1"
      );
      expect(response.status).toBe(200);

      const songs = response.body;
      expect(songs).toBeInstanceOf(Array);
      expect(songs.length).toBe(1);

      const song = songs[0];
      expect(song.title).toBe("Song1");
      expect(song.artist).toBe("Artist1");
      expect(song.date).toBe("2023-05-01T00:00:00.000Z");
      expect(song.photo).toBe("https://example.com/photo1.jpg");
    });
  });

  describe("POST /api/song", () => {
    it("should create a new song", async () => {
      const userData = {
        name: "John Doe",
        username: "john@example.com",
        password: "password",
      };
      const user = await User.create(userData);
      const token = jwt.generateToken(user._id);

      const newSongData = {
        title: "New Song",
        artist: "New Artist",
        date: "2023-05-01",
        photo: "https://example.com/photo.jpg",
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
        },
        user: user._id,
      };
      const response = await request(app)
        .post("/api/song")
        .set("Authorization", `Bearer ${token}`)
        .send(newSongData);
      expect(response.status).toBe(201);

      const createdSong = response.body;
      expect(createdSong.title).toBe("New Song");
      expect(createdSong.artist).toBe("New Artist");
      expect(createdSong.date).toBe("2023-05-01T00:00:00.000Z");
      expect(createdSong.photo).toBe("https://example.com/photo.jpg");
      expect(createdSong.location).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      });
      expect(createdSong.user).toBe(user._id.toString());

      // Verificar que la canción se haya guardado en la base de datos
      const songInDB = await Song.findById(createdSong._id);
      expect(songInDB).toBeTruthy();
    });
  });
});
