import { relations } from 'drizzle-orm';

import { developersTable } from './developer/developer.schema.js';
import { gameDevelopersTable } from './game/game-developer.schema.js';
import { gameDurationsTable } from './game/game-duration.js';
import { gameGenresTable } from './game/game-genre.schema.js';
import { gamePlatformsTable } from './game/game-platform.schema.js';
import { gamesTable } from './game/game.schema.js';
import { genresTable } from './genre/genre.schema.js';
import { platformsTable } from './platform/platform.schema.js';

export const gamesRelations = relations(gamesTable, ({ many, one }) => ({
  gamePlatforms: many(gamePlatformsTable),
  gameGenres: many(gameGenresTable),
  gameDevelopers: many(gameDevelopersTable),
  duration: one(gameDurationsTable),
}));

export const gamePlatformsRelations = relations(gamePlatformsTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [gamePlatformsTable.gameId],
    references: [gamesTable.id],
  }),
  platform: one(platformsTable, {
    fields: [gamePlatformsTable.platformId],
    references: [platformsTable.id],
  }),
}));

export const gameGenresRelations = relations(gameGenresTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [gameGenresTable.gameId],
    references: [gamesTable.id],
  }),
  genre: one(genresTable, {
    fields: [gameGenresTable.genreId],
    references: [genresTable.id],
  }),
}));

export const gameDevelopersRelations = relations(gameDevelopersTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [gameDevelopersTable.gameId],
    references: [gamesTable.id],
  }),
  developer: one(developersTable, {
    fields: [gameDevelopersTable.developerId],
    references: [developersTable.id],
  }),
}));

export const gameDurationsRelations = relations(gameDurationsTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [gameDurationsTable.gameId],
    references: [gamesTable.id],
  }),
}));

export const platformsRelations = relations(platformsTable, ({ many }) => ({
  gamePlatforms: many(gamePlatformsTable),
}));

export const genresRelations = relations(genresTable, ({ many }) => ({
  gameGenres: many(gameGenresTable),
}));

export const developersRelations = relations(developersTable, ({ many }) => ({
  gameDevelopers: many(gameDevelopersTable),
}));
