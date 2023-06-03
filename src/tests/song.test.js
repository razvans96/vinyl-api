/* eslint-disable no-unused-vars */
const request = require("supertest");
const app = require("../app");
const Song = require("../models/Song");
const db = require("../config/database");

describe("Añadir y obtener canciones", () => {
  beforeAll(async () => {
    await db.connectDB();
  });

  beforeEach(async () => {
    await Song.deleteMany();
    // Crea un par de canciones de prueba
    const song1 = {
      title: "Song1",
      artist: "Artist1",
      date: "2023-05-01",
      photo: "https://example.com/photo1.jpg",
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      },
    };

    const song2 = {
      title: "Song2",
      artist: "Artist2",
      date: "2023-05-02",
      photo: "https://example.com/photo2.jpg",
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      },
    };
    let response = await request(app).post("/api/songs").send(song1);
    expect(response.status).toBe(201);
    this.song1Id = response.body.id;
    response = await request(app).post("/api/songs").send(song2);
    this.song2Id = response.body.id;
  });

  afterAll(async () => {
    await db.closeDB();
  });

  describe("GET /api/songs", () => {
    it("should return a list of songs", async () => {
      const response = await request(app).get("/api/songs");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return songs with correct attributes", async () => {
      const response = await request(app).get("/api/songs");
      const songs = response.body;

      // Verificar los atributos de una canción
      const song = songs[0];
      expect(song).toHaveProperty("_id");
      expect(song).toHaveProperty("title");
      expect(song).toHaveProperty("artist");
      expect(song).toHaveProperty("date");
      expect(song).toHaveProperty("photo");
      expect(song).toHaveProperty("location");
    });
  });

  describe("GET /api/songs", () => {
    it("should return filtered songs based on search parameters", async () => {
      const response = await request(app).get(
        "/api/songs/search?title=Song1&artist=Artist1"
      );
      expect(response.status).toBe(200);

      const songs = response.body;
      expect(songs).toBeInstanceOf(Array);
      expect(songs.length).toBe(1);

      const song = songs[0];
      expect(song.title).toBe("Song1");
      expect(song.artist).toBe("Artist1");
    });
  });

  describe("POST /api/songs", () => {
    it("should create a new song", async () => {
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
      };
      const response = await request(app).post("/api/songs").send(newSongData);
      expect(response.status).toBe(201);

      const createdSong = response.body;
      expect(createdSong).toHaveProperty("_id");
      expect(createdSong.title).toBe("New Song");
      expect(createdSong.artist).toBe("New Artist");
      expect(createdSong.date).toBe("2023-05-01T00:00:00.000Z");
      expect(createdSong.photo).toBe("https://example.com/photo.jpg");
      expect(createdSong.location).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      });
    });
  });
});