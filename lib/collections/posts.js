// Purposely not use 'var'. In Meteor, var is scoped to a single file.
// We want Posts to be accessible to all of your app, so we leave out var.
Posts = new Mongo.Collection('posts');