# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.2] - 2020-03-27 
Updated by [Omar Villa](https://github.com/ovillamx)

### Added
- Design changes:
    * Width of panels: document and resources. The width of resources panel has been shortened.
    * Cover node, to include the journal name at the top of the document (in red).

### Changed

### Removed

### Fixed
- Fixed footnote links, when there is a **\<sup\>** tag inside the **\<xref\>**, the links were duplicating in the reader.


## [1.0.1] - 2020-03-19 
Updated by [Omar Villa](https://github.com/ovillamx)

### Added
- A custom Lens named **SPSConverter**. It is actived when the *specific-use* attribute in **\<article\>** tag has the string: 'sps-\*', where \* is the SciELO PS version. See [SciELO PS specs](https://scielo.readthedocs.io/projects/scielo-publishing-schema/pt_BR/master/tagset/elemento-article.html)
- Read and process original references from **\<mixed-citation\>** tag. See [SciELO PS specs](https://scielo.readthedocs.io/projects/scielo-publishing-schema/pt_BR/master/tagset/elemento-mixed-citation.html).
- Read and render reference type from **\<element-citation\>** tag. See [SciELO PS specs](https://scielo.readthedocs.io/projects/scielo-publishing-schema/pt_BR/master/tagset/elemento-element-citation.html)

### Changed
- Updated [assets/index.html](assets/index.html) with latest [MathJax](https://www.mathjax.org/) supported version.

### Removed
- All stuff related to parse and render the elements of **\<element-citation\>** in references
