"""Definition of Gens command line interface."""
import logging

import click
from click import secho
from flask.cli import AppGroup, current_app

LOG = logging.getLogger(__name__)

# define groups of commands
update_group = AppGroup('update')

@click.command('transcripts', short_help="Update transcript annotations")
@click.option("f", "file", help="Input file for updating mongoDB with chromosome transcripts")
@click.option("u", "update", is_flag=True, help="Update existing database with new information")
@click.option("m", "mane", help="Mane file for updating transcripts")
@click.option("h", "hg_type", help="Set hg-type", default="38")
def update_transcripts(file, update, mane, hg_type):
    """Update transcripts in Gens database."""
    LOG.info('Running Gens update transcripts')
    secho('done', fg='green')
