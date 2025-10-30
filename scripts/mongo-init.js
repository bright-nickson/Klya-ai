// MongoDB initialization script for KLYA AI
db = db.getSiblingDB('KLYA-ai');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        firstName: {
          bsonType: 'string',
          maxLength: 50
        },
        lastName: {
          bsonType: 'string',
          maxLength: 50
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin', 'moderator']
        },
        isActive: {
          bsonType: 'bool'
        },
        emailVerified: {
          bsonType: 'bool'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ 'subscription.plan': 1 });
db.users.createIndex({ 'location.region': 1 });
db.users.createIndex({ 'businessType': 1 });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ lastLogin: -1 });

// Create content collection
db.createCollection('content', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'type', 'content', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId'
        },
        type: {
          bsonType: 'string',
          enum: ['blog', 'social', 'email', 'ad', 'product', 'custom']
        },
        content: {
          bsonType: 'string'
        },
        language: {
          bsonType: 'string',
          enum: ['en', 'tw', 'ga', 'ew', 'ha']
        },
        tone: {
          bsonType: 'string',
          enum: ['professional', 'casual', 'friendly', 'formal']
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.content.createIndex({ userId: 1, createdAt: -1 });
db.content.createIndex({ type: 1 });
db.content.createIndex({ language: 1 });

// Create transcriptions collection
db.createCollection('transcriptions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'transcription', 'language', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId'
        },
        transcription: {
          bsonType: 'string'
        },
        language: {
          bsonType: 'string',
          enum: ['en', 'tw', 'ga', 'ew', 'ha']
        },
        fileName: {
          bsonType: 'string'
        },
        fileSize: {
          bsonType: 'number'
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.transcriptions.createIndex({ userId: 1, createdAt: -1 });
db.transcriptions.createIndex({ language: 1 });

// Create analytics collection for tracking
db.createCollection('analytics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'action', 'timestamp'],
      properties: {
        userId: {
          bsonType: 'objectId'
        },
        action: {
          bsonType: 'string'
        },
        metadata: {
          bsonType: 'object'
        },
        timestamp: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.analytics.createIndex({ userId: 1, timestamp: -1 });
db.analytics.createIndex({ action: 1, timestamp: -1 });

print('✅ KLYA AI database initialized successfully!');
print('📊 Collections created: users, content, transcriptions, analytics');
print('🔍 Indexes created for optimal performance');
