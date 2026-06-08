import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'students';

// Initialize database
export const initDatabase = async () => {
  try {
    const existing = await SecureStore.getItemAsync(STORAGE_KEY);
    if (existing === null) {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify([]));
      console.log('✅ Database initialized');
    }
    return { success: true };
  } catch (error) {
    console.error('Init error:', error);
    return { success: false, error: error.message };
  }
};

// CREATE - Add new student
export const addStudent = async (name, email, phone, course) => {
  try {
    // Get existing students
    const existingData = await SecureStore.getItemAsync(STORAGE_KEY);
    const students = existingData ? JSON.parse(existingData) : [];
    
    // Create new student object
    const newStudent = {
      id: Date.now(), // Simple unique ID
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      course: course.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Add to array
    students.push(newStudent);
    
    // Save back to storage
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(students));
    
    console.log('✅ Student added:', newStudent.name);
    return { success: true, data: newStudent };
  } catch (error) {
    console.error('Add student error:', error);
    return { success: false, error: error.message };
  }
};

// READ - Get all students
export const getStudents = async () => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEY);
    const students = data ? JSON.parse(data) : [];
    return { success: true, data: students };
  } catch (error) {
    console.error('Get students error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// READ - Get single student by ID
export const getStudentById = async (id) => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEY);
    const students = data ? JSON.parse(data) : [];
    const student = students.find(s => s.id === parseInt(id));
    
    if (student) {
      return { success: true, data: student };
    } else {
      return { success: false, error: 'Student not found' };
    }
  } catch (error) {
    console.error('Get student error:', error);
    return { success: false, error: error.message };
  }
};

// UPDATE - Update student information
export const updateStudent = async (id, name, email, phone, course) => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEY);
    const students = data ? JSON.parse(data) : [];
    
    // Find and update student
    const index = students.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      return { success: false, error: 'Student not found' };
    }
    
    // Update student data
    students[index] = {
      ...students[index],
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      course: course.trim(),
      updatedAt: new Date().toISOString()
    };
    
    // Save back to storage
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(students));
    
    console.log('✅ Student updated:', name);
    return { success: true, data: students[index] };
  } catch (error) {
    console.error('Update student error:', error);
    return { success: false, error: error.message };
  }
};

// DELETE - Remove student
export const deleteStudent = async (id) => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEY);
    const students = data ? JSON.parse(data) : [];
    
    // Filter out the student to delete
    const filteredStudents = students.filter(s => s.id !== parseInt(id));
    
    // Check if student was found and deleted
    if (filteredStudents.length === students.length) {
      return { success: false, error: 'Student not found' };
    }
    
    // Save back to storage
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(filteredStudents));
    
    console.log('✅ Student deleted, ID:', id);
    return { success: true };
  } catch (error) {
    console.error('Delete student error:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Clear all students (useful for testing)
export const clearAllStudents = async () => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify([]));
    console.log('✅ All students cleared');
    return { success: true };
  } catch (error) {
    console.error('Clear error:', error);
    return { success: false, error: error.message };
  }
};