# BirdBotScanner
This is the code for a twitter bot that lives here: https://twitter.com/RareBirdBot_SCL. The bot tweets a subset of notable eBird observations for Santa Clara County. Other county bots may be added at a later date.


## What gets tweeted?
The bot tweets only observations that eBird flags as notable. However, it adds additional filtering to target only species that birders might reasonably want to chase. A Wilson's Warbler in December, for example, might trigger an eBird alert, but would not be tweeted. Many introduced species (e.g. Scaly-breasted Munia) and known resident species (e.g. Rufous-crowned Sparrow) will also not be tweeted. *(Note: this bot is still under development and species filtering in-progress).*

The bot also attempts to "deduplicate" rare birds signtings. Currently, that means the same species will not be tweeted twice in the same week.
