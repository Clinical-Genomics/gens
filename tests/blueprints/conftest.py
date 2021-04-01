"""Fixtures for testing flask views."""

import pytest
from gens.app import create_app

@pytest.fixture(scope='session')
def app(real_database_name):
    '''Flask app fixture.'''
    app = create_app(config=dict(
        TESTING=True,
        DEBUG=True,
        MONGO_DBNAME=real_database_name,
        LOGIN_DISABLED=True,
    ))
    return app
