
CREATE TABLE "public".user_revenue (
    id serial PRIMARY KEY,  
    user_id varchar NOT NULL UNIQUE,  
    revenue numeric DEFAULT 0 NOT NULL
);

CREATE INDEX idx_user_id ON "public".user_revenue (user_id);
