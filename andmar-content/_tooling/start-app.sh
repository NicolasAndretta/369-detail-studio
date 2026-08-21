#!/bin/bash
cd /home/user/369-detail-studio
set -a; . ./.env.local; set +a
export SUPABASE_URL=http://127.0.0.1:54321
export SUPABASE_SERVICE_ROLE_KEY=local-fixture-not-a-real-key
export NO_PROXY="127.0.0.1,localhost"
export no_proxy="127.0.0.1,localhost"
exec npm run start
