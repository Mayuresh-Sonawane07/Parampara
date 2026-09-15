import sqlite3

def run_migration():
    conn = sqlite3.connect('parampara.db')
    c = conn.cursor()

    # 1. Update source URLs to verified genuine institutional endpoints
    updates = [
        ('https://ich.unesco.org/en/RL/traditional-brass-and-copper-craft-of-utensil-making-among-the-thatheras-of-jandiala-guru-punjab-india-00845', 1),
        ('https://sangeetnatak.gov.in/', 2),
        ('https://ipindia.gov.in/', 3),
        ('https://indian.handicrafts.gov.in/', 4),
        ('https://ich.unesco.org/en/RL/chhau-dance-00337', 5),
        ('https://sangeetnatak.gov.in/', 6),
        ('https://www.intach.org/', 7),
        ('https://ipindia.gov.in/', 8),
    ]

    for url, sid in updates:
        c.execute('UPDATE sources SET url = ? WHERE id = ?', (url, sid))
    print(f"Updated {len(updates)} source URLs in parampara.db.")

    # 2. Ensure user_id column exists on contributions table
    c.execute("PRAGMA table_info(contributions)")
    cols = [row[1] for row in c.fetchall()]
    if 'user_id' not in cols:
        print('Adding user_id column to contributions table...')
        c.execute('ALTER TABLE contributions ADD COLUMN user_id INTEGER REFERENCES users(id)')
    else:
        print('user_id column already exists in contributions.')

    conn.commit()

    print('\nVerifying updated sources:')
    c.execute('SELECT id, organization, url FROM sources')
    for r in c.fetchall():
        print(f"  [ID {r[0]}] {r[1]} -> {r[2]}")

    conn.close()

if __name__ == '__main__':
    run_migration()
