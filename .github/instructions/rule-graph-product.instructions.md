---
description: Apply the Nihongo-Learn rule-graph product philosophy when adding learner-facing grammar modules, rule data, examples, or practice.
applyTo: '**/*'
---

Before changing a learner-facing grammar module, read `docs/产品理念与扩展规范.md`.

Keep the product centered on explaining and remembering Japanese rules, not daily tasks or learning management. Every category must be a first-class, selectable path with its own detailed examples; a summary card must not replace the full rule path. Use progressive disclosure: core memory formula first, detailed path and contrasts next, exceptions nearby, lightweight recall after, and complete lookup last. For non-conjugation topics such as particles, model semantic role -> form -> sentence position -> example -> contrast rather than forcing the topic into an inflection table. Preserve the static, data-driven, `file://`-compatible architecture and run existing regression checks after changes.
