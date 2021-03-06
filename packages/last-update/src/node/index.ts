import { defaultTransformer, getGitLastUpdatedTimeStamp } from "./time";

import type { PluginOptionAPI } from "@mr-hope/vuepress-types";
import type { LastUpdateOptions } from "../types";

export = (options: LastUpdateOptions): PluginOptionAPI => ({
  name: "last-updated",

  extendPageData($page): void {
    const { transformer } = options;
    const timestamp = getGitLastUpdatedTimeStamp($page._filePath);
    const { $lang } = $page._computed;

    if (timestamp) {
      const lastUpdated =
        typeof transformer === "function"
          ? transformer(timestamp, $lang)
          : defaultTransformer(timestamp, $lang, options.timezone);

      $page.lastUpdated = lastUpdated;
      $page.lastUpdatedTime = timestamp;
    }
  },
});
