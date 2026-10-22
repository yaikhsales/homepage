#!/usr/bin/env python3
"""Cooperative cross-machine publishing lock stored atomically in Git origin."""
import argparse
import datetime
import json
import subprocess
import sys

REF = 'refs/heads/ops/cloudflare-deploy-lock'

def git(*args, data=None, check=True):
    result = subprocess.run(['git', *args], input=data, text=True, capture_output=True)
    if check and result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result

def current():
    lines = git('ls-remote', 'origin', REF).stdout.strip().splitlines()
    return lines[0].split()[0] if lines else None

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='action', required=True)
    take = commands.add_parser('acquire')
    take.add_argument('--owner', required=True, help='Chat/session ID or assigned integrator name')
    take.add_argument('--commit', default='HEAD', help='Integrated source commit to publish')
    commands.add_parser('status')
    for name in ('check', 'release'):
        cmd = commands.add_parser(name)
        cmd.add_argument('--token', required=True, help='Commit token returned by acquire')
    args = parser.parse_args()
    if args.action == 'acquire':
        source = git('rev-parse', '--verify', args.commit + '^{commit}').stdout.strip()
        tree = git('mktree', data='').stdout.strip()
        details = json.dumps({'owner': args.owner, 'source': source, 'acquired_utc': datetime.datetime.now(datetime.timezone.utc).isoformat()}, sort_keys=True)
        token = git('commit-tree', tree, '-m', details).stdout.strip()
        # Expected absent: concurrent creation is rejected by the Git server.
        result = git('push', '--force-with-lease=' + REF + ':', 'origin', token + ':' + REF, check=False)
        if result.returncode:
            held = current()
            if held:
                print('BUSY: another session owns the deployment lock. WAIT. Token: ' + held, file=sys.stderr)
                return 2
            raise RuntimeError(result.stderr.strip())
        print(token)
        return 0
    held = current()
    if args.action == 'status':
        if not held:
            print('FREE: no deployment owner')
            return 0
        git('fetch', '--quiet', 'origin', REF)
        print('BUSY: ' + held)
        print(git('show', '-s', '--format=%B', held).stdout.strip())
        return 2
    if held != args.token:
        raise RuntimeError('Lock ownership mismatch; do not deploy or release another session\'s lock.')
    if args.action == 'check':
        print('OWNED: ' + held)
    else:
        git('push', '--force-with-lease=' + REF + ':' + args.token, 'origin', ':' + REF)
        print('RELEASED: next session may acquire the lock')
    return 0

if __name__ == '__main__':
    try:
        sys.exit(main())
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
