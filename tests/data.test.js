const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const dataDirectory = path.join(root, "data");
const imageDirectory = path.join(root, "assets", "img");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function assertNonEmptyString(value, fieldName) {
  assert.equal(typeof value, "string", `${fieldName} must be a string`);
  assert.notEqual(value.trim(), "", `${fieldName} must not be empty`);
}

function assertImageExists(relativePath, fieldName) {
  assertNonEmptyString(relativePath, fieldName);
  assert.match(relativePath, /^assets\/img\//, `${fieldName} must point inside assets/img`);
  assert.match(relativePath, /\.(avif|gif|jpe?g|png|svg|webp|ico)$/i, `${fieldName} must use an image file`);

  const absolutePath = path.resolve(root, relativePath);
  const relativeToAssets = path.relative(imageDirectory, absolutePath);
  assert.ok(
    relativeToAssets !== ".." &&
      !relativeToAssets.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativeToAssets),
    `${fieldName} must not escape assets/img`
  );
  assert.ok(fs.existsSync(path.dirname(absolutePath)), `${fieldName} directory does not exist: ${path.dirname(absolutePath)}`);
  assert.ok(fs.statSync(absolutePath).isFile(), `${fieldName} file does not exist: ${relativePath}`);
}

test("all JSON files in data parse successfully", () => {
  const jsonFiles = fs.readdirSync(dataDirectory).filter((name) => name.endsWith(".json"));
  assert.ok(jsonFiles.length > 0, "data directory must contain JSON files");

  jsonFiles.forEach((fileName) => {
    assert.doesNotThrow(() => readJson(path.join("data", fileName)), `${fileName} must be valid JSON`);
  });
});

test("Home data contains the hero content, navigation labels, and portrait asset", () => {
  const portfolio = readJson("data/portfolio.json");
  const heroFields = [
    "backdrop",
    "greeting",
    "role",
    "intro",
    "firstName",
    "lastName",
    "skillLeft",
    "skillRight",
    "copyright",
    "documentTitle",
    "portraitAlt"
  ];

  heroFields.forEach((field) => assertNonEmptyString(portfolio.hero?.[field], `portfolio.hero.${field}`));
  ["home", "education", "skills", "project", "contact"].forEach((page) => {
    assertNonEmptyString(portfolio.navigation?.[page], `portfolio.navigation.${page}`);
  });

  const homeMarkup = fs.readFileSync(path.join(root, "page", "home.html"), "utf8");
  const portraitPath = homeMarkup.match(/<img\b[^>]*\bsrc="([^"]+)"/i)?.[1];
  assert.ok(portraitPath, "Home page must declare its portrait image");
  assertImageExists(portraitPath, "Home portrait");
});

test("Education data contains the required fields for every record", () => {
  const education = readJson("data/education.json");
  assert.ok(Array.isArray(education) && education.length > 0, "education.json must be a non-empty array");

  education.forEach((record, index) => {
    assertNonEmptyString(record?.level, `education[${index}].level`);
    assertNonEmptyString(record?.school_name, `education[${index}].school_name`);
  });
});

test("Skills data contains valid records and image files", () => {
  const skills = readJson("data/skills.json");
  assert.ok(Array.isArray(skills) && skills.length > 0, "skills.json must be a non-empty array");

  const orders = new Set();
  skills.forEach((record, index) => {
    assert.ok(Number.isInteger(record?.order), `skills[${index}].order must be an integer`);
    assert.ok(!orders.has(record.order), `skills[${index}].order must be unique`);
    orders.add(record.order);
    assertNonEmptyString(record?.name_of_skill, `skills[${index}].name_of_skill`);
    assertImageExists(record?.image_url, `skills[${index}].image_url`);
  });
});

test("Project data contains valid descriptions and image files", () => {
  const projects = readJson("data/project.json");
  assert.ok(Array.isArray(projects) && projects.length > 0, "project.json must be a non-empty array");

  projects.forEach((record, index) => {
    assertNonEmptyString(record?.project_name, `projects[${index}].project_name`);
    assertNonEmptyString(record?.description, `projects[${index}].description`);
    assertImageExists(record?.image, `projects[${index}].image`);
  });
});

test("Contact data contains required contact details and secure map URLs", () => {
  const contact = readJson("data/contact.json");

  ["email", "phone", "instagram", "tiktok", "google_map", "google_map_embed"].forEach((field) => {
    assertNonEmptyString(contact[field], `contact.${field}`);
  });
  assert.match(contact.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "contact.email must be a valid email address");
  ["instagram", "tiktok", "google_map", "google_map_embed"].forEach((field) => {
    assert.equal(new URL(contact[field]).protocol, "https:", `contact.${field} must use HTTPS`);
  });
  assert.match(contact.google_map_embed, /(?:[?&])output=embed(?:&|$)/, "contact.google_map_embed must be an embeddable map URL");
});

test("image asset directories used by the portfolio exist", () => {
  ["", "user", "skills", "project", "pavicon"].forEach((directory) => {
    const assetPath = path.join(imageDirectory, directory);
    assert.ok(fs.existsSync(assetPath), `Image asset directory does not exist: ${assetPath}`);
    assert.ok(fs.statSync(assetPath).isDirectory(), `Image asset path is not a directory: ${assetPath}`);
  });
});
