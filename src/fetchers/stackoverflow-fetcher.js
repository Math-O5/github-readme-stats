const { request, logger, CustomError } = require("../common/utils");
const axios = require("axios");
const retryer = require("../common/retryer");

require("dotenv").config();



const stackoverflowUserFetcher = async (ids) => {
  const fetchUser = (variables, token) => {
    console.log("Variables: ", variables);
    return axios({
      method: "get",
      url: `https://api.stackexchange.com/2.2/users/${variables.login}?order=desc&sort=reputation&site=stackoverflow`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });
  }

  try {
    let res = await retryer(fetchUser, { login: ids });
    if (res) {
    // console.log("Fetched: ", res);
      return res;
    }
  } catch (err) {
    // console.log("error");
    logger.log(err);
    // just return 0 if there is something wrong so that
    // we don't break the whole app
    return 0;
  }
};

async function fetchStackUser(ids) {
  if (!ids) throw Error("Invalid user");

  const stack = {
    name: "",
    reputation: 0,
    totalGoldBagdes: 0,
    totalSilverBagdes: 0,
    totalBronzeBagdes: 0,
  };

  let res = await retryer(stackoverflowUserFetcher, ids);
//   console.log("REs: ", res.data);
  if (res.data.errors) {
    logger.error(res.data.errors);
    throw new CustomError(
      res.data.errors[0].message || "Could not fetch user",
      CustomError.USER_NOT_FOUND
    );
  }

  console.log("See");

  const user = res.data.items[0];
  stack.name = user.display_name;
  stack.reputation = user.reputation;
  stack.totalGoldBagdes = user.badge_counts.gold;
  stack.totalSilverBagdes = user.badge_counts.silver;
  stack.totalBronzeBagdes = user.badge_counts.bronze;

  return stack;
}

module.exports = fetchStackUser;
