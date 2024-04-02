import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { google } from "googleapis";
import ApiError from "../utils/ApiError.js";
import { addMinutesInDate, getFormatedTime } from "../utils/utils.js";

import dotenv from "dotenv";
import sendMail from "../services/Mailer.js";

dotenv.config({
  path: "./config.env",
});

// const GOOGLE_PRIVATE_KEY = "AIzaSyBI-laG6zIXzDpStOPT2sZAgbHwo_jS9ds";

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

export const getEvents = AsyncHandler(async (_, res) => {
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (error, result) => {
      if (error) {
        return ApiError(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Events can't fetched",
          error.toString()
        );
      } else {
        if (result.data.items.length) {
          return ApiResponse(
            res,
            StatusCodes.OK,
            { events: result.data.items },
            "Events fetched"
          );
        } else {
          return ApiResponse(
            res,
            StatusCodes.OK,
            {},
            "No upcoming events found."
          );
        }
      }
    }
  );
});

export const createEvent = AsyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const from = new Date();
  const to = addMinutesInDate(new Date(), 10);

  const event = {
    summary: `${username} Login Event`,
    location: "Delhi, India",
    description: "This is event for internship in Get Me therepy IT Company",
    start: {
      dateTime: from.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: to.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
  const auth = new google.auth.GoogleAuth({
    keyFile: "event-system-8b12b-19e62ca52294.json",
    scopes: "https://www.googleapis.com/auth/calendar",
  });
  auth.getClient().then((a) => {
    calendar.events.insert(
      {
        auth: a,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: event,
      },
      function (err, event) {
        if (err) {
          return ApiError(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            "There was an error contacting the Calendar service: " + err,
            { err }
          );
        }

        sendMail(
          email,
          `${username} Login Event`,
          `Event Created from : ${from.toLocaleTimeString()}, to : ${to.toLocaleTimeString()} on ${from.toLocaleDateString()}
          <br/>
          <a href="${event.data?.htmlLink}">${event.data?.htmlLink}</a>
          `
        );
        return ApiResponse(
          res,
          StatusCodes.OK,
          {},
          "Event successfully created!"
        );
      }
    );
  });
});
