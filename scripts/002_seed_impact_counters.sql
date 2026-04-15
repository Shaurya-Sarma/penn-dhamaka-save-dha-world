-- Insert initial row if it doesn't exist
INSERT INTO impact_counters (id, trees_planted, messages_sent, shares)
VALUES ('global', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
