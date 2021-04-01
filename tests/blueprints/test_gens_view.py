"""Test Gens view."""

def test_gens_homepage(app):
    """Test gens app view."""
    raise
    with app.test_client() as client:
        rv = client.get('/')
        assert rv.status_code == 200
