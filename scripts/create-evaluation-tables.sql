-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create evaluation_results table
CREATE TABLE IF NOT EXISTS evaluation_results (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL,
    speaker VARCHAR(10),
    prompt_number INTEGER,
    model_type VARCHAR(20),
    audio_file_url TEXT,
    naturalness JSONB DEFAULT '{}',
    intelligibility JSONB DEFAULT '{}',
    likert_responses JSONB DEFAULT '{}',
    user_text TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_demographics table
CREATE TABLE IF NOT EXISTS user_demographics (
    id SERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    gender VARCHAR(20),
    age_range VARCHAR(20),
    education VARCHAR(50),
    akan_proficiency JSONB DEFAULT '{}',
    akan_dialect VARCHAR(50),
    other_dialect VARCHAR(100),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_survey_responses table
CREATE TABLE IF NOT EXISTS app_survey_responses (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    -- Intention to Use
    IN2 INTEGER NOT NULL,
    IN3 INTEGER NOT NULL,
    IN4 INTEGER NOT NULL,
    -- Effort
    EF1 INTEGER NOT NULL,
    EF2 INTEGER NOT NULL,
    EF3 INTEGER NOT NULL,
    -- Credibility
    CR1 INTEGER NOT NULL,
    CR2 INTEGER NOT NULL,
    CR3 INTEGER NOT NULL,
    -- Satisfaction
    SA1 INTEGER NOT NULL,
    SA2 INTEGER NOT NULL,
    SA3 INTEGER NOT NULL,
    -- Perceived Usefulness
    PU1 INTEGER NOT NULL,
    PU2 INTEGER NOT NULL,
    PU3 INTEGER NOT NULL,
    -- Perceived Ease of Use
    PE1 INTEGER NOT NULL,
    PE2 INTEGER NOT NULL,
    PE3 INTEGER NOT NULL,
    -- Attitude Towards Using
    AT1 INTEGER NOT NULL,
    AT2 INTEGER NOT NULL,
    AT3 INTEGER NOT NULL,
    AT4 INTEGER NOT NULL,
    -- Behavioral Intention
    BI1 INTEGER NOT NULL,
    BI2 INTEGER NOT NULL,
    BI3 INTEGER NOT NULL,
    -- Actual Use
    AU1 INTEGER NOT NULL,
    AU2 INTEGER NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_evaluation_results_session_id ON evaluation_results(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_results_section ON evaluation_results(section);
CREATE INDEX IF NOT EXISTS idx_user_demographics_session_id ON user_demographics(session_id);
CREATE INDEX IF NOT EXISTS idx_app_survey_responses_session_id ON app_survey_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
