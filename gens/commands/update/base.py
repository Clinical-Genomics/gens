"""Command group entry point."""
import logging
import click

from .transcripts import update_transcripts as transcript_command
LOG = logging.getLogger(__name__)


@click.group()
@click.pass_context
def update(context):
    """
    Update objects in the database.
    """
    pass


# add commands to group
update.add_command(transcript_command)
