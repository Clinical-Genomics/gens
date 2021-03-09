"""Update chromosome size information in Gens database."""
import logging

import click
from click import secho
from flask.cli import AppGroup, current_app

LOG = logging.getLogger(__name__)

@click.command('chrom_sizes', short_help="Update chromosome size information.")
@click.option("f", "file", help="Input file for updating mongoDB with chromosome transcripts")
@click.option("u", "update", is_flag=True, help="Update existing database with new information")
@click.option("m", "mane", help="Mane file for updating transcripts")
@click.option("h", "hg_type", help="Set hg-type", default="38")
def update_chromosome_size(file, update, mane, hg_type):
    """Update transcripts in Gens database."""
    LOG.info('Running Gens update chrom_sizes.')
    secho('done', fg='green')
