import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 1.5,
    backgroundColor: '#3B3738',
    flexDirection: 'row',
  },
  app_title: {
    flex: 7,
    padding: 10,
  },
  header_button_container: {
    flex: 2,
    justifyContent: 'center',
    paddingRight: 5,
  },
  header_text: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  body: {
    flex: 19,
  },
  list_item: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    flexDirection: 'row',
  },
  list_item_text: {
    flex: 8,
    color: '#575757',
    fontSize: 18,
  },
  list_item_button: {
    flex: 2,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: 30,
  },
  attendees_container: {
    flex: 1,
  },
});

export default styles;
