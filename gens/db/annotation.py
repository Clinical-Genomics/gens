"""Function for reading information from the database."""

import datetime
import logging
from collections import defaultdict
from itertools import groupby

from flask import current_app as app

from .models import VariantCategory

LOG = logging.getLogger(__name__)

# define collection names
ANNOTATIONS = "annotations"
TRANSCRIPTS = "transcripts"
UPDATES = "updates"


def register_data_update(track_type, name=None):
    """Register that a track was updated."""
    db = app.config["GENS_DB"][UPDATES]
    LOG.debug(f"Creating timestamp for {track_type}")
    track = {"track": track_type, "name": name}
    db.delete_many(track)  # remove old track
    db.insert_one({**track, "timestamp": datetime.datetime.now()})


def get_timestamps(track_type="all"):
    """Get when a annotation track was last updated."""
    LOG.debug(f"Reading timestamp for {track_type}")
    db = app.config["GENS_DB"][UPDATES]
    if track_type == "all":
        query = db.find()
    else:
        query = db.find({"track": track_type})

    # build results from query
    results = defaultdict(list)
    for key, entries in groupby(query, key=lambda x: x["track"]):
        for entry in entries:
            results[key].append(
                {
                    "tack": entry["track"],
                    "name": entry["name"],
                    "timestamp": entry["timestamp"].strftime("%Y-%m-%d"),
                }
            )
    return results


def query_variants(case_id: str, sample_name: str, variant_category: VariantCategory, **kwargs):
    """Search the scout database for variants associated with a case.

    case_id :: id for a case
    sample_name :: display name for a sample
    variant_category :: categories

    Kwargs are optional search parameters that are passed to db.find().
    """
    db = app.config["SCOUT_DB"]
    # build query
    query = {
        "case_id": case_id,
        "category": variant_category.value,
        "$or": [{"samples.sample_id": sample_name},
                {"samples.display_name": sample_name}]
    }
    # add chromosome
    if "chromosome" in kwargs:
        query["chromosome"] = kwargs["chromosome"]
    # add start, end position to query
    if all(param in kwargs for param in ["start_pos", "end_pos"]):
        query = {
            **query,
            **_make_query_region(
                kwargs["start_pos"], kwargs["end_pos"], variant_category.value
            ),
        }
    # query database
    LOG.info(f"Query variant database: {query}")
    return db.variant.find(query)


def _make_query_region(start_pos: int, end_pos: int, motif_type="other"):
    """Make a query for a chromosomal region."""
    if motif_type == "sv":  # for sv are start called position
        start_name = "position"
    else:
        start_name = "start"
    pos = {"$gte": start_pos, "$lte": end_pos}
    return {
        "$or": [
            {start_name: pos},
            {"end": pos},
            {"$and": [{start_name: {"$lte": start_pos}}, {"end": {"$gte": end_pos}}]},
        ],
    }


def query_records_in_region(
    record_type,
    chrom,
    start_pos,
    end_pos,
    genome_build,
    height_order=None,
    **kwargs,
):
    """Query the gens database for transcript information."""
    # build base query
    query = {
        "chrom": chrom,
        "genome_build": genome_build,
        **_make_query_region(start_pos, end_pos),
        **kwargs,  # add optional search params
    }
    # build sort order
    sort_order = [("start", 1)]
    if height_order is None:
        sort_order.append(("height_order", 1))
    else:
        query["height_order"] = height_order
    # query database
    return app.config["GENS_DB"][record_type].find(
        query, {"_id": False}, sort=sort_order
    )
