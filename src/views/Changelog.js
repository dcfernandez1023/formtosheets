import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

const Changelog = (props) => {

  const changelog = [
    {
      name: "Beta Testing",
      description: <p>
        The initial launch of the application with basic functionality, including:
        <ul>
          <li> Add up to 3 forms </li>
          <li> Add elements to the form and edit those elements </li>
          <li> Ability to preview, publish, unpublish, view analytics, and delete your form </li>
          <li> Ability to set an access key for your form </li>
          <li> Ability to direct your form's submissions to your Google Sheet </li>
        </ul>
      </p>,
      tags: [
        {name: "Release", variant: "success"}
      ],
      date: "August 29, 2021"
    },
  ];

  return (
    <Container>
      <br/>
      <Row>
        <Col>
          <h2 style = {{height: "50px"}}> formtosheets Changelog </h2>
        </Col>
      </Row>
      <hr />
      {changelog.map((entry, index) => {
        return (
          <div>
            <Row key={index}>
              <Col xs={12}>
                <h4> {entry.name} </h4>
              </Col>
              <Col xs={12} style = {{marginBottom: "5px"}}>
                <p> <i> Posted {entry.date} </i> </p>
              </Col>
              <Col xs={12}>
                {entry.description}
              </Col>
              <Col xs={12}>
                <p>
                  Tags:
                  {entry.tags.map((tag) => {
                    return (
                      <Badge style={{marginLeft: "8px"}} bg={tag.variant} pill> {tag.name} </Badge>
                    );
                  })}
                </p>
              </Col>
            </Row>
            {changelog.length > 1 ?
              <hr />
            :
              <div></div>
            }
          </div>
        );
      })}
    </Container>
  );
}

export default Changelog;
