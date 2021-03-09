"""Code for command line base."""
import logging

import click

from gens import __version__
from gens.commands.update import update as update_command

LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
LOG = logging.getLogger(__name__)


@click.pass_context
def loglevel(ctx):
    """Set app cli log level"""
    log_level = ctx.find_root().params["loglevel"]
    log_format = None
    coloredlogs.install(level=log_level, fmt=log_format)
    LOG.info(f"Running Gens version { __version__}")
    LOG.debug("Debug logging enabled.")


@click.version_option(__version__)

@click.option("-p", "--port", help="Specify on what port to listen for the mongod")
@click.option("-h", "--host", help="Specify the host for the mongo database.")
@with_appcontext
def cli(**_):
    """scout: manage interactions with a scout instance."""
    loglevel()


cli.add_command(update)
