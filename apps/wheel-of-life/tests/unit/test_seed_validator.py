from app.validators.seed_validator import validate_seed_bundles


def test_seed_bundles_validate() -> None:
    report = validate_seed_bundles()
    assert report['ok'] is True
    assert report['checked_bundles'] >= 8
    assert report['issues'] == []
