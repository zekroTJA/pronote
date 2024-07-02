CREATE TABLE "user" (
    "id" VARCHAR(40) NOT NULL,
    "registered_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

CREATE TABLE "list" (
    "id" VARCHAR(20) NOT NULL,
    "owner_id" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "timeout_seconds" INT,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("owner_id") 
        REFERENCES "user"("id") 
        ON DELETE CASCADE
);

CREATE TABLE "item" (
    "id" VARCHAR(20) NOT NULL,
    "list_id" VARCHAR(20) NOT NULL,
    "part" INT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "edited_at" TIMESTAMPTZ NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("list_id")
        REFERENCES "list"("id")
        ON DELETE CASCADE
);