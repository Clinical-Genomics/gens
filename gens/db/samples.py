"""Store and retrive samples from the database."""

import datetime
import itertools
import logging

from pymongo import ASCENDING

from .models import SampleObj

LOG = logging.getLogger(__name__)

COLLECTION = "samples"


def store_sample(db, sample_id, genome_build, baf, coverage, overview):
    """Store a new sample in the database."""
    LOG.info(f'Store sample "{sample_id}" in database')
    db[COLLECTION].insert_one(
        {
            "sample_id": sample_id,
            "baf_file": baf,
            "coverage_file": coverage,
            "overview_file": overview,
            "genome_build": genome_build,
            "created_at": datetime.datetime.now(),
        }
    )


def get_samples(db, start=0, n_samples=None):
    """
    Get samples stored in the databse.

    use n_samples to limit the results to x most recent samples
    """
    results = (
        SampleObj(
            sample_id=r["sample_id"],
            genome_build=r["genome_build"],
            baf_file=r["baf_file"],
            coverage_file=r["coverage_file"],
            overview_file=r["overview_file"],
            created_at=r["created_at"],
        )
        for r in db[COLLECTION].find().sort("created_at", ASCENDING)
    )
    # limit results to n results
    if n_samples and 0 < n_samples:
        results = itertools.islice(results, start=start, stop=start + n_samples)
    return results


def query_sample(db, sample_id, genome_build):
    """Get a sample with id."""
    result = db[COLLECTION].find_one({"sample_id": sample_id})

    if result is None:
        raise ValueError(f'No sample with id: "{sample_id}" in database')
    return SampleObj(
        sample_id=result["sample_id"],
        genome_build=result["genome_build"],
        baf_file=result["baf_file"],
        coverage_file=result["coverage_file"],
        overview_file=result["overview_file"],
        created_at=result["created_at"],
    )
