# BirdBotScanner
This is the code for a twitter bot that lives here: https://twitter.com/RareBirdBot_SCL. The bot tweets a subset of notable eBird observations for Santa Clara County. Other county bots may be added at a later date.


## What gets tweeted?
The bot tweets only observations that eBird flags as notable. However, it adds additional filtering to target only species that birders might reasonably want to chase. A Wilson's Warbler in December, for example, might trigger an eBird alert, but would not be tweeted. Many introduced species (e.g. Scaly-breasted Munia) and known resident species (e.g. Rufous-crowned Sparrow) will also not be tweeted. *(Note: this bot is still under development and species filtering in-progress).*

The bot also attempts to "deduplicate" rare birds signtings. Currently, that means the same species will not be tweeted twice in the same week.

## Contributing
Filtering is a work in progress. If you'd like to contribute to the species filters for Santa Clara County, please edit [the text file](https://github.com/KevinGin/BirdBotScanner/blob/main/denyList/US-CA-085.txt) and submit a pull request (you can do this in the browser). 

Interested in bringing a bot to another county in California? I'm happy to set up a bot for other counties, but would require a volunteer for species filtering (if desired). Please contact me directly.
